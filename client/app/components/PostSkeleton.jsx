import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

const PostSkeleton = memo(() => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
      <div className="ml-16">
        <Skeleton className="h-[380px] w-[200px]" />
      </div>
    </div>
  );
});

export default PostSkeleton;
