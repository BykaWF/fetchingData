"use client";

import { useState } from 'react'
import './App.css'
import { useQuery } from '@tanstack/react-query';
const BASE_URL = 'https://jsonplaceholder.typicode.com'

interface Post {
  id: number;
  title: string;
}


function App() {
  const [page, setPage] = useState(0);

  const {
    data: posts,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/posts?page=${page}`);
      return (await response.json()) as Post[];
    }
  })

  return (
    <div>
      <h1>Data Fetching in React</h1>
      <button onClick={() => setPage(page + 1)}>Next Page {page}</button>
      <button onClick={() => setPage(page - 1)}>Prev Page {page}</button>
      {isPending && (
        <div>Loading...</div>
      )}
      {!isPending && (
        <ul>
          {posts?.map((post) => {
            return <li key={post.id}>{post.title}</li>
          })}
        </ul>
      )}
    </div>

  )
}

export default App
