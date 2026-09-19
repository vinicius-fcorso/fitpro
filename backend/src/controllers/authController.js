const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Nome, email, senha e perfil são obrigatórios."
      });
    }

    if (!["PERSONAL", "ALUNO"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Perfil inválido."
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Este email já está cadastrado."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
  const createdUser = await tx.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    }
  });

  if (role === "PERSONAL") {
    await tx.trainer.create({
      data: {
        userId: createdUser.id
      }
    });
  }

  return createdUser;
});

    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios."
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou senha inválidos."
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Email ou senha inválidos."
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.json({
      success: true,
      message: "Login realizado com sucesso.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Erro no login:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado."
      });
    }

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

module.exports = {
  register,
  login,
  me
};