"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
export function SignInNotice(){const params=useSearchParams(); useEffect(()=>{if(params.get("reason")==="protected") toast.error("এই পেজটি দেখতে আগে সাইন ইন করুন");},[params]); return null;}
