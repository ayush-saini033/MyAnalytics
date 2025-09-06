"use client";
import Header from "@/app/_components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/config/Subpabase.Client";
import useUser from "@/hooks/useUser";
import { redirect } from "next/dist/server/api-utils";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useSyncExternalStore } from "react";
import { HiRefresh } from "react-icons/hi";

const WebsitePage = () => {
  const user = useUser();
  const { website } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [pageViews, setPageViews] = useState([]);
  const [totalVisits, setTotalVisits] = useState();
  const [groupedPageViews,setGroupedPageViews] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };


  useEffect(() => {
    if (!user) return;
    if (user.role !== "authenticated") redirect("/signin");
    const checkWebsiteCurrentUser = async () => {
      const { data, error } = await supabase
        .from("websites")
        .select()
        .eq("website_name", website)
        .eq("user_id", user?.id);

      data.length === 0
        ? redirect("/dashboard")
        : setTimeout(() => {
            fetchViews();
          }, 500);
    };
    checkWebsiteCurrentUser();
  }, [user]);


  const fetchViews = async () => {
    setIsLoading(true);
    try {
      const [viewsResponse, visitsResponse] = await Promise.all([
        supabase.from("page_views").select().eq("domain", website),
        supabase.from("visits").select().eq("website_id", website),
      ]);
      const views = viewsResponse.data
      const visits = visitsResponse.data
 
      setPageViews(views);
      setGroupedPageViews(groupPageViews(views))
      setTotalVisits(visits)
    } catch (error) {
      console.log(error);
    }
    finally {
        setIsLoading(false);
    }
  };

    const abbreviateNumber = (number) => {
      if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + "M";
      } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + "K";
      } else {
        return number?.toString();
      }
    };

  function groupPageViews (pageViews) {
    const groupedPageViews = {}
    pageViews.forEach(({page}) => {
        // Extract the path from the page URL by removing the protocal and hostanme
        const path = page.replace(/^(?:\/\/|[^/]+)*\//, "")

        groupedPageViews[path] = (groupedPageViews[path] || 0) + 1;
    });

    return Object.keys(groupedPageViews).map((page) => ({
        page: page,
        visits: groupedPageViews[page]
    }))
  }




  if(isLoading) {
    return(
        <div className="min-h-screen">
            <Header/>
            <div className="flex-1 flex items-center justify-center">
                <h1 className="text-white text-4xl">loading...</h1>
            </div>
        </div>
    )
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {pageViews?.length === 0 && !isLoading ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <div
            className="w-full lg:w-2/3 bg-black border border-white/5 py-12 px-8 
        flex flex-col items-center justify-center text-white space-y-4 relative"
          >
            <p className="bg-green-600 rounded-full p-4 animate-pulse" />
            <p className="animate-pulse">waiting for the first page view</p>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-5 py-2.5 
                 bg-emerald-600 hover:bg-emerald-700 
                 text-white font-medium rounded-xl shadow 
                 transition-all duration-300 hover:scale-105 
                 active:scale-95 cursor-pointer"
            >
              <HiRefresh
                className={`text-lg transition-transform ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <div className="w-full md:w-3/4 border border-white/5 pb-6 mt-12">
              {/* <Snippet /> */}
              snippet
            </div>
          </div>
        </div>
      ) : (
        <div
          className="z-40 w-[95%] md:w-3/4 lg:w-2/3 min-h-screen py-6 border-x border-white/5
        items-center justify-start flex flex-col"
        >
          <div className="w-full justify-center flex items-center">
            <Tabs
              defaultValue="general"
              className="w-full items-center justify-center flex flex-col"
            >
              {" "}
              <TabsList className="w-full bg-transparent mb-4 items-start justify-start flex">
                <TabsTrigger value="general">general</TabsTrigger>
                <TabsTrigger value="custom Events">custom Events</TabsTrigger>
              </TabsList>
              <TabsContent className="w-full text-white" value="general">
                <div className="w-full"></div>
                <div
                  className="w-full grid grid-cols-1 md:grid-cols-2 px-4
           gap-6"
                >
                  <div className="bg-black border-white/5 border text-white text-center">
                    <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/5">
                      TOTAL VISITS
                    </p>
                    <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                      {abbreviateNumber(totalVisits?.length)}
                    </p>
                  </div>
                  <div className="bg-black border-white/5 border text-white text-center">
                    <p className="font-medium text-white/70 py-8  w-full text-center border-b border-white/5">
                      PAGE VIEWS
                    </p>
                    <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                      {abbreviateNumber(pageViews?.length)}
                    </p>
                  </div>
                </div>
                <div
                  className="items-center justify-center grid grid-cols-1 bg-black 
           lg:grid-cols-2 mt-12 w-full border-y border-white/5"
                >
                  {/* top pages */}
                  <div className="flex flex-col bg-black z-40 h-full w-full">
                    <h1 className="label">Top Pages</h1>
                    {groupedPageViews.map((view) => (
                    <div
                      key={view}
                      className="text-white w-full items-center justify-between 
                  px-6 py-4 border-b border-white/5 flex"
                    >
                      <p className="text-white/70 font-light">/{view.page}</p>
                      <p className="">{abbreviateNumber(view.visits)}</p>
                    </div>
                  ))}
                  </div>
                  {/* top sources */}
                  <div
                    className="flex flex-col bg-black z-40 h-full w-full
             lg:border-l border-t lg:border-t-0 border-white/5"
                  >
                    <h1 className="label relative">
                      Top Visit Sources
                      <p className="absolute bottom-2 right-2 text-[10px] italic font-light">
                        add ?utm={"{source}"} to track
                      </p>
                    </h1>
                    {/* {groupedPageSources.map((pageSource) => (
                    <div
                      key={pageSource}
                      className="text-white w-full items-center justify-between 
                  px-6 py-4 border-b border-white/5 flex"
                    >
                      <p className="text-white/70 font-light">
                        /{pageSource.source}
                      </p>
                      <p className="text-white/70 font-light">
                        <p className="">
                          {abbreviateNumber(pageSource.visits)}
                        </p>
                      </p>
                    </div>
                  ))} */}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsitePage;
