import toast, { Toaster } from 'react-hot-toast';

const fetchWrapper = async (url: string, options: { [key: string]: string } = {}) => {
  const response = await fetch(
    'http://localhost:5000' + url,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    }
  );
  if (response.status == 200) {
    return await response.json()
  } else {
    const text = await response.text()
    throw new Error(JSON.parse(text)["exception"])
  }
}

const onError = (error: { message: string }) => {
  toast.error(`${error.message}`);
}

export default fetchWrapper;
export { onError };