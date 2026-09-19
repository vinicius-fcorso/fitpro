const prisma = require("../utils/prisma");

async function createWorkout(req, res) {
  try {
    const { studentId, name, description, exercises } = req.body;

    if (!studentId || !name) {
      return res.status(400).json({
        success: false,
        message: "Aluno e nome do treino são obrigatórios."
      });
    }

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: "O treino deve possuir pelo menos um exercício."
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
        id: Number(studentId),
        trainerId: trainer.id
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Aluno não encontrado."
      });
    }

    const workout = await prisma.workout.create({
      data: {
        name,
        description: description || null,
        trainerId: trainer.id,
        studentId: student.id,

        exercises: {
          create: exercises.map((exercise, index) => ({
            exerciseName: exercise.exerciseName,
            sets: Number(exercise.sets),
            reps: Number(exercise.reps),
            weight:
              exercise.weight !== undefined && exercise.weight !== null
                ? Number(exercise.weight)
                : null,
            restSeconds:
              exercise.restSeconds !== undefined &&
              exercise.restSeconds !== null
                ? Number(exercise.restSeconds)
                : null,
            order:
              exercise.order !== undefined
                ? Number(exercise.order)
                : index + 1,
            notes: exercise.notes || null
          }))
        }
      },

      include: {
        exercises: {
          orderBy: {
            order: "asc"
          }
        },

        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: "Treino criado com sucesso.",
      workout
    });
  } catch (error) {
    console.error("Erro ao criar treino:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

async function getMyWorkouts(req, res) {
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

    const workouts = await prisma.workout.findMany({
      where: {
        trainerId: trainer.id
      },

      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },

        exercises: {
          orderBy: {
            order: "asc"
          }
        }
      },

      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json({
      success: true,
      workouts
    });
  } catch (error) {
    console.error("Erro ao buscar treinos:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

async function getWorkoutById(req, res) {
  try {
    const workoutId = Number(req.params.id);

    if (!Number.isInteger(workoutId)) {
      return res.status(400).json({
        success: false,
        message: "ID do treino inválido."
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

    const workout = await prisma.workout.findFirst({
      where: {
        id: workoutId,
        trainerId: trainer.id
      },

      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },

        exercises: {
          orderBy: {
            order: "asc"
          }
        }
      }
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Treino não encontrado."
      });
    }

    return res.json({
      success: true,
      workout
    });
  } catch (error) {
    console.error("Erro ao buscar treino:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

async function updateWorkout(req, res) {
  try {
    const workoutId = Number(req.params.id);

    if (!Number.isInteger(workoutId)) {
      return res.status(400).json({
        success: false,
        message: "ID do treino inválido."
      });
    }

    const { name, description, exercises } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "O nome do treino é obrigatório."
      });
    }

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: "O treino deve possuir pelo menos um exercício."
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

    const workout = await prisma.workout.findFirst({
      where: {
        id: workoutId,
        trainerId: trainer.id
      }
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Treino não encontrado."
      });
    }

    const updatedWorkout = await prisma.$transaction(async (tx) => {
      await tx.workoutExercise.deleteMany({
        where: {
          workoutId: workout.id
        }
      });

      return await tx.workout.update({
        where: {
          id: workout.id
        },

        data: {
          name,
          description: description || null,

          exercises: {
            create: exercises.map((exercise, index) => ({
              exerciseName: exercise.exerciseName,
              sets: Number(exercise.sets),
              reps: Number(exercise.reps),

              weight:
                exercise.weight !== undefined &&
                exercise.weight !== null
                  ? Number(exercise.weight)
                  : null,

              restSeconds:
                exercise.restSeconds !== undefined &&
                exercise.restSeconds !== null
                  ? Number(exercise.restSeconds)
                  : null,

              order:
                exercise.order !== undefined
                  ? Number(exercise.order)
                  : index + 1,

              notes: exercise.notes || null
            }))
          }
        },

        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },

          exercises: {
            orderBy: {
              order: "asc"
            }
          }
        }
      });
    });

    return res.json({
      success: true,
      message: "Treino atualizado com sucesso.",
      workout: updatedWorkout
    });
  } catch (error) {
    console.error("Erro ao atualizar treino:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

async function deleteWorkout(req, res) {
  try {
    const workoutId = Number(req.params.id);

    if (!Number.isInteger(workoutId)) {
      return res.status(400).json({
        success: false,
        message: "ID do treino inválido."
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

    const workout = await prisma.workout.findFirst({
      where: {
        id: workoutId,
        trainerId: trainer.id
      }
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Treino não encontrado."
      });
    }

    await prisma.workout.delete({
      where: {
        id: workout.id
      }
    });

    return res.json({
      success: true,
      message: "Treino excluído com sucesso."
    });
  } catch (error) {
    console.error("Erro ao excluir treino:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor."
    });
  }
}

module.exports = {
  createWorkout,
  getMyWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
};