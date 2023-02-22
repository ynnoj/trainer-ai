'use client'

import type { User } from '@clerk/nextjs/dist/api'

import { Fragment, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { Menu, Transition } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function AppPageLayout({
  children,
  user
}: {
  children: React.ReactNode
  user: Partial<User>
}) {
  const { signOut } = useClerk()
  const router = useRouter()

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const handleSignOut = (): void => {
    signOut()

    router.push('/')
  }

  const userNavigation = useMemo(
    () => [
      { name: 'Your Profile', onClick: () => console.log('profile') },
      { name: 'Sign out', onClick: () => handleSignOut() }
    ],
    []
  )

  return (
    <html lang="en" className="h-full bg-gray-50">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="h-full overflow-hidden">
        <div className="flex h-full">
          <div className="flex flex-1 flex-col overflow-hidden">
            <header className="w-full">
              <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
                <div className="flex flex-1 justify-end px-4 sm:px-6">
                  <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
                    <Menu as="div" className="relative flex-shrink-0">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={user.profileImageUrl}
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <button
                                  onClick={item.onClick}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'w-full px-4 py-2 text-left text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-full bg-indigo-600 p-1 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <PlusIcon className="h-6 w-6" aria-hidden="true" />
                      <span className="sr-only">Add file</span>
                    </button>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex flex-1 items-stretch overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
