import { AnalysisPage } from '../components/UI/AnalysisPage';
export function NavigationAssistant() {
  return (
    <AnalysisPage
      title="Navigation Assistant"
      subtitle="Detect obstacles and find safe paths"
      analysisType="navigation"
      tips={[
        'Hold camera at waist height pointing forward',
        'AI identifies obstacles and clear paths',
        'Receives guidance: left, right, straight ahead',
        'Works best in consistent lighting conditions',
        'Re-capture every few steps for updated guidance',
      ]}
    />
  );
}
