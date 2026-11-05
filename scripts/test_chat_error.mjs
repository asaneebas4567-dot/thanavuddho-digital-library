import { synthesizeGroundedDhammaAnswer } from './src/lib/dhammaSynthesisEngine.ts';

async function test() {
  try {
    const res = await synthesizeGroundedDhammaAnswer('ยมทูตในนรก มีอายุขัยไหม');
    console.log('SUCCESS:', res);
  } catch (err) {
    console.error('ERROR CAUGHT:');
    console.error(err);
  }
}

test();

