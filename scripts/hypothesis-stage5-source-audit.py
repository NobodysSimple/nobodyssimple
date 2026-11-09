#!/usr/bin/env python3
"""Read the uploaded synthetic database ZIP without extracting it.
Produces structural QA and a blinded clinician/lived-experience review pack.
Synthetic cases are NOT gold standards, clinical probabilities or patients.
"""
import argparse
import csv
import hashlib
import json
import re
import tempfile
import zipfile
from collections import Counter
from pathlib import Path

FILES = ['manifest.json','questions_all.jsonl','mechanisms.jsonl',
         'cases_synthetic.jsonl','curated_examples.jsonl','branching_routes.jsonl']
RUBRIC = ['factual_fidelity','causal_calibration','differential_quality',
          'contradiction_handling','context_and_power','non_pathologising',
          'usefulness_and_clarity','question_burden']
UNKNOWN = {'skip','unsure','prefer_not','none_of_these','not_sure'}

def rows(z, name):
    for n,line in enumerate(z.open(name),1):
        if line.strip():
            try: yield json.loads(line)
            except ValueError as err: raise ValueError(f'{name}:{n}: {err}') from err

def audit(path, out):
    path,out=Path(path),Path(out)
    out.mkdir(parents=True,exist_ok=True)
    sha=hashlib.sha256()
    with path.open('rb') as f:
        for part in iter(lambda:f.read(1048576),b''): sha.update(part)
    with zipfile.ZipFile(path) as z:
        if set(FILES)-set(z.namelist()):
            raise ValueError('Required corpus tables are missing')
        manifest=json.load(z.open('manifest.json'))
        questions=list(rows(z,'questions_all.jsonl'))
        mechs=list(rows(z,'mechanisms.jsonl'))
        curated=list(rows(z,'curated_examples.jsonl'))
        ids={q['id']:q for q in questions}
        mids={m['id'] for m in mechs}
        texts=Counter(re.sub(r'\s+',' ',q['text'].casefold().strip(' .?!'))
                      for q in questions)
        concepts=Counter(q.get('concept_id') for q in questions)
        missing_parents=bad_answers=escape_missing=0
        for q in questions:
            escape_missing+=not bool(set(q.get('options') or ()) & UNKNOWN)
            for raw in q.get('requires') or ():
                parent,sep,answer=raw.partition('=')
                if parent not in ids: missing_parents+=1
                elif sep and answer not in ids[parent].get('options',[]): bad_answers+=1
        routes=missing_route_questions=0
        for route in rows(z,'branching_routes.jsonl'):
            routes+=1
            missing_route_questions+=sum(qid not in ids for qid in route.get('questions',[]))
        case_count=turns=duplicate_case_concepts=not_synthetic=not_unvalidated=0
        nonnull_probabilities=unknown_mechanisms=0
        families=set()
        types=Counter()
        for case in rows(z,'cases_synthetic.jsonl'):
            case_count+=1
            families.add(case.get('source_atlas_id'))
            types[case.get('source_kind')]+=1
            not_synthetic+=case.get('synthetic') is not True
            not_unvalidated+=case.get('independent_clinical_validation') is not False
            sequence=case.get('fictional_question_answer_sequence') or []
            turns+=len(sequence)
            duplicate_case_concepts+=sum(n-1 for n in Counter(
                x.get('concept_id') for x in sequence).values() if n>1)
            for h in case.get('candidate_hypotheses') or ():
                nonnull_probabilities+=h.get('calibrated_probability') is not None
                unknown_mechanisms+=h.get('mechanism_id') not in mids
        report={
            'corpus_sha256':sha.hexdigest(),
            'declared_questions':manifest.get('all_question_count'),
            'questions':len(questions),'unique_ids':len(ids),
            'unique_concept_ids':len(concepts),
            'same_wording_excess':sum(n-1 for n in texts.values() if n>1),
            'same_wording_groups':sum(n>1 for n in texts.values()),
            'repeated_concept_ids':sum(n-1 for n in concepts.values() if n>1),
            'question_origins':dict(Counter(q.get('origin') for q in questions)),
            'no_explicit_uncertainty_or_skip_option':escape_missing,
            'invalid_prerequisite_question_ids':missing_parents,
            'invalid_prerequisite_answer_codes':bad_answers,
            'branching_routes':routes,'invalid_route_question_ids':missing_route_questions,
            'mechanisms':len(mechs),'mechanism_probabilities_null':all(
                m.get('empirical_conditional_probability') is None for m in mechs),
            'synthetic_cases':case_count,'source_atlas_families':len(families),
            'case_types':dict(types),'fictional_answer_turns':turns,
            'repeated_concepts_within_cases':duplicate_case_concepts,
            'cases_mislabelled_as_real':not_synthetic,
            'cases_mislabelled_as_clinically_validated':not_unvalidated,
            'candidate_probabilities_not_null':nonnull_probabilities,
            'candidate_mechanism_references_missing':unknown_mechanisms,
            'curated_cases':len(curated),
            'curated_safety_or_medical_flags':sum(bool(x.get('safety',{}).get(
                'safety_or_medical_review_needed_if_indicated')) for x in curated),
            'expert_ground_truth_cases':0,'clinical_accuracy':None
        }
        (out/'source-audit.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf8')
        for name,header,format_row in [
            ('blind-review-cases.csv',
             ['case_id','fictional_scenario','reviewer_id','blinded_initial_formulation','missing_information'],
             lambda c:[c['id'],c.get('scenario',''),'','','']),
            ('unblinded-reference.csv',
             ['case_id','source_editorial_counterpoint','safety_review_flag','editorial_candidate_mechanisms_not_truth'],
             lambda c:[c['id'],c.get('critical_counterpoint',''),
                       bool(c.get('safety',{}).get('safety_or_medical_review_needed_if_indicated')),
                       '; '.join(x.get('mechanism_id','') for x in c.get('candidate_hypotheses',[]))]),
            ('independent-scoring.csv',
             ['case_id','reviewer_role','reviewer_id','blind_condition',*RUBRIC,
              'serious_safety_issue','unsupported_claims','missing_alternatives','notes'],
             lambda c:[c['id'],'','','',*(['']*len(RUBRIC)),'','','',''])
        ]:
            with (out/name).open('w',newline='',encoding='utf8') as f:
                w=csv.writer(f);w.writerow(header)
                for case in curated:w.writerow(format_row(case))
        md=['# Stage 5 — synthetic source audit','',
            'This measures corpus consistency, NOT clinical accuracy or causal truth.','',
            'Corpus SHA256: '+report['corpus_sha256'],'',
            '| Check | Result |','|---|---:|']
        md += ['| '+k.replace('_',' ')+' | '+str(v)+' |'
               for k,v in report.items() if isinstance(v,(int,bool)) or v is None]
        md += ['','## Interpretation','',
               'Identical wording is a candidate for SEMANTIC review, not automatically a duplicate.',
               'Unique concept IDs do not guarantee unique concepts.',
               'Prerequisites of the form question=answer are checked against question and response code.',
               'Cases sharing source or generated templates are not independent clinical observations.',
               'The questions in the ZIP cannot be replayed as if they used the same answer schema as the current app.',
               'Unblinded editorial hypotheses are not a gold-standard adjudication.',
               'Expert review must actually take place before any empirical validity claim.',
               '','## Reviewer criteria (0–3, or N/A with written rationale)','']
        md += ['- '+x.replace('_',' ').title() for x in RUBRIC]
        (out/'source-audit.md').write_text('\n'.join(md)+'\n',encoding='utf8')
        return report

def selftest():
    with tempfile.TemporaryDirectory() as tmp:
        path=Path(tmp)/'mini.zip'
        with zipfile.ZipFile(path,'w') as z:
            z.writestr('manifest.json',json.dumps({'all_question_count':1}))
            z.writestr('questions_all.jsonl',json.dumps(
                {'id':'Q','concept_id':'C','text':'When?','options':['yes','skip'],
                 'origin':'sample','requires':[]})+'\n')
            z.writestr('mechanisms.jsonl',json.dumps({'id':'M','empirical_conditional_probability':None})+'\n')
            z.writestr('branching_routes.jsonl',json.dumps({'questions':['Q']})+'\n')
            case={'id':'F','source_atlas_id':'A','source_kind':'curated','scenario':'Fictional',
                  'synthetic':True,'independent_clinical_validation':False,
                  'fictional_question_answer_sequence':[],
                  'candidate_hypotheses':[{'mechanism_id':'M','calibrated_probability':None}],
                  'safety':{}}
            for name in ('curated_examples.jsonl','cases_synthetic.jsonl'):
                z.writestr(name,json.dumps(case)+'\n')
        results=audit(path,Path(tmp)/'out')
        assert results['questions']==results['synthetic_cases']==1
        assert results['invalid_prerequisite_question_ids']==0
    print('Stage 5 corpus QA self-test passed')

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--zip',type=Path)
    p.add_argument('--out',type=Path,default=Path('stage5-audit-output'))
    p.add_argument('--self-test',action='store_true')
    a=p.parse_args()
    if a.self_test:selftest()
    elif a.zip:print(json.dumps(audit(a.zip,a.out),indent=2))
    else:p.error('Provide --zip or --self-test')
