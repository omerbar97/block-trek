import { Contributer } from "@prisma/client";


export function sumAmountsOfContribution(contributors: Contributer[]): bigint {
    return contributors.reduce((acc, contributor) => {
      return acc + BigInt(contributor.amount);
    }, BigInt(0));
}
  