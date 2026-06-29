type FavoriteButtonProps = {
  favorited: boolean;
  favoritesCount: number;
  isLoggedIn: boolean;
  onFavorite: () => void;
  onUnfavorite: () => void;
};

export default function FavoriteButton({
  favorited,
  favoritesCount,
  isLoggedIn,
  onFavorite,
  onUnfavorite,
}: FavoriteButtonProps): JSX.Element {
  const handleClick = () => {
    if (!isLoggedIn) return;
    if (favorited) {
      onUnfavorite();
    } else {
      onFavorite();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isLoggedIn}
      title={!isLoggedIn ? "Log in to favorite articles" : undefined}
      className={`rounded border border-green-500 px-3 py-1 text-sm transition-colors
        ${favorited}
        disabled:cursor-not-allowed disabled:opacity-50
      `}
    >
      ♥ {favoritesCount}
    </button>
  );
}
