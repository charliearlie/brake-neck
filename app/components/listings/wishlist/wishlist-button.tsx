import { Link, useFetcher } from "@remix-run/react";
import { HeartIcon } from "lucide-react";
import { useUser } from "~/contexts/user-context";

import { Button } from "~/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/common/ui/dialog";

import { cn } from "~/util/utils";

type Props = {
  inWishlist: boolean;
  listingId: string;
} & React.HTMLAttributes<HTMLButtonElement>;

export const WishlistButton = ({ className, inWishlist, listingId }: Props) => {
  const user = useUser();
  const fetcher = useFetcher();

  // This works removing the delay when adding to wishlist but removing still has a delay
  const likesListing =
    fetcher.formData?.get("intent") === "favourite" ? !inWishlist : inWishlist;

  const Cta = () => (
    <>
      <HeartIcon
        className={cn(
          "h-6 w-6 flex-shrink-0 text-foreground group-hover:fill-destructive group-hover:text-destructive",
          likesListing &&
            "fill-destructive text-destructive group-hover:fill-accent group-hover:text-foreground dark:text-destructive"
        )}
        aria-hidden="true"
      />
      <span className="hidden sm:flex">
        {likesListing ? "In wishlist" : "Add to Wishlist"}
      </span>
      <span className="sr-only">Add to favorites</span>
    </>
  );

  if (user.userId) {
    return (
      <fetcher.Form className={className} method="post">
        <Button
          name="intent"
          value="favourite"
          variant="outline"
          size="lg"
          className={cn("group flex w-full items-center gap-2")}
        >
          <Cta />
        </Button>
        <input type="hidden" name="listingId" value={listingId} />
      </fetcher.Form>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={cn("group flex items-center gap-2", className)}
        >
          <Cta />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log in required</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Log in to bidhub to add item to your wishlist
        </DialogDescription>
        <DialogFooter>
          <Button asChild>
            <Link to="/login">Log in</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
