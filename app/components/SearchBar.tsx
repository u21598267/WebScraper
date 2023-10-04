"use client"
import { scrapeAndStoreProduct } from '@/lib/actions';
import Image from 'next/image'
import { FormEvent,useState } from 'react'

const isValidateSearchTerm = (url : string) => {
    try{
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      const pathname = parsedUrl.pathname;


      // Check if the hostname is amazon.com 
      if(hostname.includes('amazon.com') || hostname.includes('amazon.') || hostname.endsWith('amazon')){
        return true;
      }
      else{
        return false;
      }

    }
    catch(error){
      return false;
    }
  }

const SearchBar = () => {

  const [searchTerm, setSearchTerm] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);




    const handleSubmit = async (event : FormEvent<HTMLFormElement>) => {
       event.preventDefault();

       const isValid = isValidateSearchTerm(searchTerm);
      
       if(!isValid){
         alert('Please enter a valid amazon product link');
         return;
       }

       try{
          setIsLoading(true);

          //Scrapping the product page
          const product = await scrapeAndStoreProduct(searchTerm);
       }
        catch(error){
          console.log(error);
        }
        finally{
          setIsLoading(false);
        }
    }


  return (
    <form 
    className="flex flex-wrap gap-4 mt-12" 
    onSubmit={handleSubmit}>
        <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        placeholder="Enter product link"
        className="searchbar-input"/>
        <button 
        type='submit' 
        className='searchbar-btn'
        disabled={searchTerm === '' || isLoading}
        >
           {isLoading ? 'Searching...' : 'Search'}
        </button>

    </form>
  )
}

export default SearchBar