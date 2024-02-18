class UserService {
  private url: string;

  constructor() {
    this.url = `https://whizout.pockethost.io/api/collections/users`;
  }

  async createUser(email: string, password: string) {
    const result = await fetch(`${this.url}/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        passwordConfirm: password,
        emailVisibility: true,
      }),
    }).then((res) => res.json());

    if (result?.id) {
      return result;
    } else {
      return new Error("Error creating user");
    }
  }

  async getUserByEmailAndPassword(email: string, password: string) {
    const result = await fetch(`${this.url}/auth-with-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identity: email,
        password: password,
      }),
    }).then((res) => res.json());

    if (result?.token) {
      return {
        token: result.token,
        user: result.record,
      };
    } else {
      return new Error("Invalid email or password");
    }
  }

  async getUserById(id: string) {
    const result = await fetch(`${this.url}/records/${id}`).then((res) =>
      res.json()
    );

    if (result?.id) {
      return result;
    } else {
      return new Error("User not found");
    }
  }

  async updateUserById(id: string, data: any) {
    console.log(data);
    const result = await fetch(`${this.url}/records/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    console.log(result);

    if (result.id) {
      return result;
    } else {
      return new Error("Error updating user");
    }
  }

  async sendVerificationEmail(email: string) {
    console.log(email);
    const result = await fetch(`${this.url}/request-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (result == null) {
      return result;
    } else {
      return new Error("Error sending verification email");
    }
  }
}

export default new UserService();
