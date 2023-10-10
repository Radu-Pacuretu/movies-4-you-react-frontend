export function NumResults({ movies }) {
  return (
    <p className="num-results">
      Results: <strong>{movies.length}</strong>
    </p>
  );
}
