import { PriorityBadge } from '../PriorityBadge';

export default function PriorityBadgeExample() {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Priority Badges</h3>
      <div className="flex flex-wrap gap-3">
        <PriorityBadge priority="low" />
        <PriorityBadge priority="medium" />
        <PriorityBadge priority="high" />
      </div>
    </div>
  );
}