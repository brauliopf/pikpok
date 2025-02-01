export default function Onboarding() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const jsonData = Object.fromEntries(formData);
    const response = await fetch("/api/users/clerk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <div>
      <h1>Onboarding</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="secret">Secret:</label>
        <input type="text" id="secret" name="secret" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
