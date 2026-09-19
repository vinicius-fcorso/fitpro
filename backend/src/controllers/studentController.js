const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");

async function createStudent(req, res) {
  try {
    const { name, email, password, birthDate, height, weight, goal } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nome, email e senha são obrigatórios."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "A senha deve ter pelo menos 6 caracteres."
      });
    }

    // Verifica se o Personal possui um perfil Trainer
    const trainer = await prisma.trainer.findUnique({
      where: {
        userId: req.user.userId
      }
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Perfil de Personal não encontrado."
      });
    }

    // Verifica se o email já está cadastrado
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Este email já está cadastrado."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "ALUNO"
        }
      });

      const createdStudent = await tx.student.create({
        data: {
          userId: user.id,
          trainerId: trainer.id,
          birthDate: birthDate ? new Date(birthDate) : null,
          height: height ? Number(height) : null,
          weight: weight ? Number(weight) : null,
          goal: goal || null
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      });

      return createdStudent;
    });

    return res.status(201).json({
      success: true,
      message: "Aluno criado com sucesso.",
      student
    });

  } catch (error) {
    console.error("Erro ao criar aluno:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

async function getMyStudents(req, res) {
  try {
    const trainer = await prisma.trainer.findUnique({
      where: {
        userId: req.user.userId
      }
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Perfil de Personal não encontrado."
      });
    }

    const students = await prisma.student.findMany({
      where: {
        trainerId: trainer.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json({
      success: true,
      students
    });

  } catch (error) {
    console.error("Erro ao buscar alunos:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

async function getStudentById(req, res) {
  try {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId)) {
      return res.status(400).json({
        success: false,
        message: "ID do aluno inválido."
      });
    }

    const trainer = await prisma.trainer.findUnique({
      where: {
        userId: req.user.userId
      }
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Perfil de Personal não encontrado."
      });
    }

    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        trainerId: trainer.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Aluno não encontrado."
      });
    }

    return res.json({
      success: true,
      student
    });

  } catch (error) {
    console.error("Erro ao buscar aluno:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

async function updateStudent(req, res) {
  try {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId)) {
      return res.status(400).json({
        success: false,
        message: "ID do aluno inválido."
      });
    }

    const {
      name,
      email,
      birthDate,
      height,
      weight,
      goal
    } = req.body;

    const trainer = await prisma.trainer.findUnique({
      where: {
        userId: req.user.userId
      }
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Perfil de Personal não encontrado."
      });
    }

    // Garante que o aluno pertence a este Personal
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        trainerId: trainer.id
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Aluno não encontrado."
      });
    }

    // Se o email estiver sendo alterado, verifica duplicidade
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: student.userId
          }
        }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Este email já está cadastrado."
        });
      }
    }

    const updatedStudent = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: student.userId
        },
        data: {
          ...(name !== undefined && { name }),
          ...(email !== undefined && { email })
        }
      });

      return tx.student.update({
        where: {
          id: student.id
        },
        data: {
          ...(birthDate !== undefined && {
            birthDate: birthDate ? new Date(birthDate) : null
          }),
          ...(height !== undefined && {
            height: height === null ? null : Number(height)
          }),
          ...(weight !== undefined && {
            weight: weight === null ? null : Number(weight)
          }),
          ...(goal !== undefined && {
            goal: goal || null
          })
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      });
    });

    return res.json({
      success: true,
      message: "Aluno atualizado com sucesso.",
      student: updatedStudent
    });

  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

async function deleteStudent(req, res) {
  try {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId)) {
      return res.status(400).json({
        success: false,
        message: "ID do aluno inválido."
      });
    }

    const trainer = await prisma.trainer.findUnique({
      where: {
        userId: req.user.userId
      }
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Perfil de Personal não encontrado."
      });
    }

    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        trainerId: trainer.id
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Aluno não encontrado."
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.workout.deleteMany({
        where: {
          studentId: student.id
        }
      });

      await tx.student.delete({
        where: {
          id: student.id
        }
      });

      await tx.user.delete({
        where: {
          id: student.userId
        }
      });
    });

    return res.json({
      success: true,
      message: "Aluno excluído com sucesso."
    });

  } catch (error) {
    console.error("Erro ao excluir aluno:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

module.exports = {
  createStudent,
  getMyStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};