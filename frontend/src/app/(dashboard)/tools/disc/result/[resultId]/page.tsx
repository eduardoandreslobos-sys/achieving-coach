'use client';

import { useParams } from 'next/navigation';
import { DISCResults } from '@/components/DISCResults';

export default function DISCResultPage() {
  const params = useParams();
  const resultId = params.resultId as string;

  return (
    <div className="p-6">
      <DISCResults resultId={resultId} />
    </div>
  );
}
