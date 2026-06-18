import type { ActionItem, RoutePath } from "../types";
import ActionCard from "./ActionCard";

interface MainActionsGridProps {
  actions: ActionItem[];
  onNavigate: (route: RoutePath) => void;
}

const MainActionsGrid = ({ actions, onNavigate }: MainActionsGridProps) => {
  const [primary, ...secondary] = actions;

  return (
    <section className="grid grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] gap-2">
      <ActionCard action={primary} onNavigate={onNavigate} />
      <div className="grid min-w-0 gap-2">
        {secondary.map((action) => (
          <ActionCard key={action.route} action={action} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
};

export default MainActionsGrid;
