import { DailySummary as DailySummaryType } from '../types/weather';
import { formatTemp } from '../utils/weatherUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from './ui/button';

interface DailySummaryProps {
  dailySummary: DailySummaryType | null;
  isCelsius: boolean;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ dailySummary, isCelsius }) => {

  if (!dailySummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Button variant='outline' size={'lg'}>Daily Summary</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          No summary available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Button variant='outline' size={'lg'}>Daily Summary</Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">

          {/* LEFT SIDE */}
          <div className="grid grid-cols-2 gap-2">
            <div>Average Temperature:</div>
            <div>
              {dailySummary.avgTemp !== undefined
                ? formatTemp(dailySummary.avgTemp, isCelsius)
                : "N/A"}
            </div>

            <div>Maximum Temperature:</div>
            <div>
              {dailySummary.maxTemp !== undefined
                ? formatTemp(dailySummary.maxTemp, isCelsius)
                : "N/A"}
            </div>

            <div>Minimum Temperature:</div>
            <div>
              {dailySummary.minTemp !== undefined
                ? formatTemp(dailySummary.minTemp, isCelsius)
                : "N/A"}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="grid grid-cols-2 gap-2">
            <div>Average Humidity:</div>
            <div>
              {dailySummary.avgHumidity !== undefined
                ? `${dailySummary.avgHumidity}%`
                : "N/A"}
            </div>

            <div>Average Wind Speed:</div>
            <div>
              {dailySummary.avgWindSpeed !== undefined
                ? `${dailySummary.avgWindSpeed} m/s`
                : "N/A"}
            </div>

            <div>Dominant Condition:</div>
            <div>
              {dailySummary.condition ?? "N/A"}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};