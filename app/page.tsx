import React, { Suspense } from 'react';
import { getFiles } from '@/utils/getFiles';

import Terminal from '@/components/Terminal';
import FallBackTerminal from '@/components/FallBackTerminal';

export default async function Home() {
  const files = await getFiles();

  return (
    <div className="flex flex-col scroll-smooth">
      <Suspense fallback={<FallBackTerminal />}>
        <Terminal files={files} />
      </Suspense>
    </div>
  );
}
