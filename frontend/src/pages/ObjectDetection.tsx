import { AnalysisPage } from '../components/UI/AnalysisPage';
export function ObjectDetection() {
  return (
    <AnalysisPage
      title="Object Detection"
      subtitle="Identify and locate objects around you"
      analysisType="objects"
      tips={[
        'AI returns object names and approximate positions',
        'Works best with clear, uncluttered scenes',
        'Can detect furniture, devices, food, and more',
        'Try pointing at specific areas for focused results',
      ]}
    />
  );
}
