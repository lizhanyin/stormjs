import path from 'path';
import { File, FS, MPQ } from '../lib';
import StormLib from '../lib/stormlib';

const rootDir = path.resolve(__filename, '../../../');

describe('MPQ', () => {
  beforeAll(() => {
    FS.mkdir('/fixture');
    FS.mount(FS.filesystems.NODEFS, { root: `${rootDir}/fixture` }, '/fixture');
  });

  describe('Opening / Closing', () => {
    test('opens and closes an MPQ', async () => {
      const mpq = await MPQ.open('/fixture/vanilla-standard.mpq');

      mpq.close();

      expect(mpq).toBeInstanceOf(MPQ);
    });

    test('throws if opening a nonexistent MPQ', async () => {
      expect.assertions(1);

      try {
        const mpq = await MPQ.open('/fixture/nonexistent.mpq');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    test('throws if closing an MPQ with an invalid handle', async () => {
      expect.assertions(1);

      const mpq = await MPQ.open('/fixture/vanilla-standard.mpq');
      const originalHandle = mpq.handle;
      const invalidHandle = new StormLib.Ptr();

      try {
        mpq.handle = invalidHandle;
        mpq.close();
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      } finally {
        mpq.handle = originalHandle;
        mpq.close();
      }
    });

    test('closes MPQ with noop if already closed', async () => {
      const mpq = await MPQ.open('/fixture/vanilla-standard.mpq');

      let result;

      result = mpq.close();
      result = mpq.close();

      expect(result).toBeUndefined();
    });
  });

  describe('Files', () => {
    test('opens and returns a valid file', async () => {
      const mpq = await MPQ.open('/fixture/vanilla-standard.mpq');
      const file = mpq.openFile('fixture.txt');

      expect(file).toBeInstanceOf(File);

      file.close();
      mpq.close();
    });

    test('returns undefined if opening a file from a closed MPQ', async () => {
      const mpq = await MPQ.open('/fixture/vanilla-standard.mpq');

      mpq.close();

      const file = mpq.openFile('fixture.txt');

      expect(file).toBeUndefined();
    });

    test('throws if opening a nonexistent file', async () => {
      expect.assertions(1);

      const mpq = await MPQ.open('/fixture/vanilla-standard.mpq');

      try {
        const file = mpq.openFile('nonexistent.txt');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }

      mpq.close();
    });
  });
});