'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            AI SDK Examples
          </h1>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/mcp-nexus"
            className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow max-w-sm w-full"
          >
            <div className="p-8">
              <h3 className="text-2xl font-medium text-gray-900 text-center">MCP Nexus</h3>
              <p className="mt-4 text-gray-600 text-center">Model Context Protocol integration</p>
              <div className="mt-6 text-center">
                <span className="inline-flex items-center text-lg font-medium text-indigo-600">
                  Enter Application
                  <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
