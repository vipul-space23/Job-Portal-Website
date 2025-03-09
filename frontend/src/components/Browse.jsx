import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        };
    }, [dispatch]);

    return (
        <div style={{ marginTop: '100px' }}>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Search Results ({Array.isArray(allJobs) ? allJobs.length : 0})</h1>
                <div className='grid grid-cols-3 gap-4'>
                    {
                        Array.isArray(allJobs) ? (
                            allJobs.map((job) => (
                                <Job key={job._id} job={job} />
                            ))
                        ) : (
                            <span>No jobs available</span>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Browse;
