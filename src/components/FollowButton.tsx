type FollowButtonProps = {
  following: boolean;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  onRestrictedAction: () => void;
  compact?: boolean;
};

export default function FollowButton({
  following,
  isOwnProfile,
  isLoggedIn,
  onFollow,
  onUnfollow,
  onRestrictedAction,
  compact = false,
}: FollowButtonProps): JSX.Element {
  const handleClick = () => {
    if (!isLoggedIn || isOwnProfile) {
      onRestrictedAction();
      return;
    }

    if (following) {
      onUnfollow();
    } else {
      onFollow();
    }
  };

  const baseClass = "rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700";
  const sizeClass = compact
    ? "px-2 py-0.5 text-xs"
    : "px-4 py-2 text-sm";

  return (
    <button onClick={handleClick} className={`${baseClass} ${sizeClass}`}>
      {following ? "Unfollow" : "Follow"}
    </button>
  );
}
