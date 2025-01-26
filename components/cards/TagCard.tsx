import Link from 'next/link';
import React from 'react';

import { Badge } from '../ui/badge';
import { Tag } from 'lucide-react';

interface TagCardProps {
  _id: string;
  name: string;
  posts?: number;
  showCount?: boolean;
  compact?: boolean;
}

const TagCard = ({ _id, name, posts, showCount }: TagCardProps) => {
  return (
    <Link href={`/tag/${_id}`} className="flex justify-between gap-2">
      <Badge variant="outline">
        <Tag className="mr-1 h-3 w-3" />
        {name}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{posts}</p>
      )}
    </Link>
  );
};

export default TagCard;
