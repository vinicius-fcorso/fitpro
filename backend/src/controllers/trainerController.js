const prisma = require("../utils/prisma");

async function getMyTrainer(req, res) {
  try {
    const trainer = await prisma.trainer.findUnique({
      where: {
        userId: req.user.userId
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

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Perfil de Personal não encontrado."
      });
    }

    return res.json({
      success: true,
      trainer
    });
  } catch (error) {
    console.error("Erro ao buscar perfil do Personal:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

async function getDashboard(req, res) {
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

    const totalStudents = await prisma.student.count({
      where: {
        trainerId: trainer.id
      }
    });

    const totalWorkouts = await prisma.workout.count({
      where: {
        trainerId: trainer.id
      }
    });

    const activeStudents = totalStudents;

    const recentStudents = await prisma.student.findMany({
      where: {
        trainerId: trainer.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    });

    const recentWorkouts = await prisma.workout.findMany({
      where: {
        trainerId: trainer.id
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    });

    return res.json({
      success: true,
      dashboard: {
        statistics: {
          totalStudents,
          totalWorkouts,
          activeStudents
        },
        recentStudents,
        recentWorkouts
      }
    });
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

module.exports = {
  getMyTrainer,
  getDashboard
};