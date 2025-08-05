import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import NewsLetter from '../components/NewsLetter'
import Footer from '../components/Footer'
import { useState } from 'react'

const Home = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
      <>
        <Navbar />
        <Header setSearchQuery={setSearchQuery} />
        <BlogList searchQuery={searchQuery} />
        <NewsLetter />
        <Footer />
      </>
    );
}

export default Home
