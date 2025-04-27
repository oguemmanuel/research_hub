"use client";

import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const AlertComponents = () => {
  return (
    <div>
    <Alert>
    <Terminal className="h-4 w-4" />
    <AlertTitle>Your project submitted successfully.</AlertTitle>
    <AlertDescription>
        This usually take 24hrs to review your project, we will get back to you soon.
    </AlertDescription>
    </Alert>
    </div>
  )
}

export default AlertComponents