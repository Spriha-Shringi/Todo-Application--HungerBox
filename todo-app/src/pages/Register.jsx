export default function Register() {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-96 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Register</h2>
          <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Username" />
          <input className="w-full p-2 border rounded mb-2" type="email" placeholder="Email" />
          <input className="w-full p-2 border rounded mb-4" type="password" placeholder="Password" />
          <button className="w-full bg-green-500 text-white p-2 rounded">Register</button>
        </div>
      </div>
    );
  }