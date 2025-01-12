import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export function StockChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full">
          <AdvancedRealTimeChart
            symbol="NASDAQ:AAPL"
            theme="dark"
            interval="D"
            container_id="tradingview_chart"
            autosize
            height={500}
            allow_symbol_change={true}
            hide_side_toolbar={false}
            details={true}
            hotlist={true}
            calendar={true}
            show_popup_button={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}