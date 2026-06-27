import { AnalysisPage } from '../components/UI/AnalysisPage';
export function SceneDescription() {
  return (
    <AnalysisPage
      title="Scene Description"
      subtitle="Get a detailed description of your surroundings"
      analysisType="scene"
      tips={[
        'Hold camera steady for best results',
        'Ensure good lighting for accurate description',
        'Point camera at the entire scene for overview',
        'Works indoors and outdoors',
      ]}
    />
  );
}
