import test from 'ava';
import { getDiagramCluster } from '../../../../scripts/ui/ui/lib.js';

test('getDiagramCluster create new', (t) => {
  const result = getDiagramCluster(2, 4);
  t.is(result.nrOfDiagrams, 2);
});

test('getDiagramCluster should refuse to add invalid data', (t) => {
  const diagCluster = getDiagramCluster(2, 4);
  const result = diagCluster.add();
  t.is(result, false);
});

test('getDiagramCluster should add data', (t) => {
  const diagCluster = getDiagramCluster(2, 4);

  const result = diagCluster.add([ 2, 8 ]);
  const firstDiagram = diagCluster.diagCluster.get(0);

  t.is(result, undefined);
  t.deepEqual(firstDiagram.values, [ 2, 0, 0, 0 ]);
});

test('getDiagramCluster should getInterestingDiagrams', (t) => {
  const diagCluster = getDiagramCluster(3, 4);

  diagCluster.add([ 2, 8, 0 ]);
  diagCluster.add([ 0, 1, 0 ]);
  diagCluster.add([ 0, 1, 0 ]);
  diagCluster.add([ 0, 1, 0 ]);

  const result = diagCluster.getInterestingDiagrams(3);
  t.is(result.length, 3);
  t.is(result[0].offset, 1);
  t.is(result[0].interesting, 7);
  t.is(result[1].offset, 0);
  t.is(result[1].interesting, 2);
  t.is(result[2].offset, 2);
  t.is(result[2].interesting, 0);
});

test('getDiagramCluster should ignore if too many getInterestingDiagrams are requested', (t) => {
  const diagCluster = getDiagramCluster(3, 4);

  diagCluster.add([ 2, 8, 0 ]);
  diagCluster.add([ 0, 1, 0 ]);
  diagCluster.add([ 0, 1, 0 ]);
  diagCluster.add([ 0, 1, 0 ]);

  const result = diagCluster.getInterestingDiagrams(100);
  t.is(result.length, 3);
});

test('getDiagramCluster should fail to add a non array', (t) => {
  const diagCluster = getDiagramCluster(3, 4);
  const result = diagCluster.add('1');
  t.is(result, false);
});

test('getDiagramCluster should fail to add an invalid number of entries', (t) => {
  const diagCluster = getDiagramCluster(3, 4);
  const result = diagCluster.add([ 1 ]);
  t.is(result, false);
});
