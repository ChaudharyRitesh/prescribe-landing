import { getModules } from '@/lib/sanity.queries';
import { ModulesShowcase } from './modules-showcase';

export async function ModulesShowcaseWrapper() {
  const modules = await getModules();
  
  return <ModulesShowcase modules={modules} />;
}
