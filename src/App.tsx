import { useEffect, useRef, useState } from 'react'
import './App.css'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

interface Post {
  id: number;
  title: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [page, setPage] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      setIsLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/posts?page=${page}`, {
          signal: abortControllerRef.current?.signal,
        });
        const posts = await response.json() as Post[];
        setPosts(posts);
      } catch (e: any) {
        if (e.name === "AbortError") {
          console.log("aborted");
          return;
        }
        setError(e);
      } finally {
        setIsLoading(false);
      }

    }

    fetchPosts();
  }, [page]);


  if (error) {
    return <div>Something went wrong! Please try again.{error}</div>
  }

  return (
    <div>
      <h1>Data Fetching in React</h1>
      <button onClick={() => setPage(page + 1)}>Next Page {page}</button>
      {isLoading && (
        <div>Loading...</div>
      )}
      {!isLoading && (
        <ul>
          {posts.map((post) => {
            return <li key={post.id}>{post.title}</li>
          })}
        </ul>
      )}
    </div>
  )
}

export default App
