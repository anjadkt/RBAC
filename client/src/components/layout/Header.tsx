function Header() {
  function handleLogout() {
    console.log('Logging out')
  }

  return (
    <header className="flex items-center justify-end bg-gray-900 px-6 py-4 text-white shadow-sm">
      <button
        type="button"
        onClick={handleLogout}
        className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
      >
        Logout
      </button>
    </header>
  )
}

export default Header
