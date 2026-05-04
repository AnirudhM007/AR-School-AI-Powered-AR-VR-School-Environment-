import { NextResponse } from 'next/server';
import { TOPICS } from '@/lib/topics';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const classId  = searchParams.get('classId');

  let result = TOPICS;
  if (category && category !== 'All') result = result.filter(t => t.category === category);
  if (classId)  result = result.filter(t => t.classIds.includes(classId));

  return NextResponse.json({ models: result });
}
