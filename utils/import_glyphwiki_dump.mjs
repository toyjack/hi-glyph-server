import { createReadStream } from 'fs';
import { PrismaClient } from '@prisma/client';
import * as readlinePromises from 'node:readline/promises';

const prisma = new PrismaClient();
const dumpFileName = 'utils/temp/dump_newest_only.txt';

async function main() {
  const rs = createReadStream(dumpFileName, {
    encoding: 'utf-8',
  });

  const rl = readlinePromises.createInterface({
    input: rs,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const [name,related,data]= line.split('|').map((cell)=>cell.trim());
    const glyphwiki = await prisma.glyphwiki.create({data:{
      name,
      related,
      data
    }})
    console.log(glyphwiki);
  }
}

main();
