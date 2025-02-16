
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export function RiskAnalysis({ position }) {
  const calculateRiskScore = (position) => {
    const score = Math.min(
      ((position.amount / position.accountBalance) * 100),
      100
    );
    return Math.round(score);
  };

  const riskScore = calculateRiskScore(position);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Position Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Risk Score</span>
              <span>{riskScore}%</span>
            </div>
            <Progress value={riskScore} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
