import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getFiles } from '@/files';

import Terminal from '@/components/Terminal';
import FallBackTerminal from '@/components/FallBackTerminal';
    
export const metadata: Metadata = {
  title: 'Terminal • Leo Mosley'
}

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
