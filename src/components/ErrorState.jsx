import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorState({ title = "Something went wrong", message = "Please try again.", onRetry }) {
  return (
    <div className="empty-state error-state">
      <AlertTriangle size={42} />
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && <button className="primary-button" onClick={onRetry}><RefreshCw size={17} /> Try again</button>}
    </div>
  );
}
