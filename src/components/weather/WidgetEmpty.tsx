import React from "react";
import { CloudOff } from "lucide-react";

const WidgetEmpty: React.FC = () => (
  <div className="widget-empty">
    <CloudOff size={48} strokeWidth={1.5} />
    <p>No cities added yet</p>
    <p className="widget-empty__hint">Click the gear icon to add a city</p>
  </div>
);

export default WidgetEmpty;
