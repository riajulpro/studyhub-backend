import Module from "../models/module.model";
import User from "../models/userModel";

export const getModuleLessons = async (moduleId: string) => {
  try {
    const module = await Module.findById(moduleId).populate("lessons");
    if (!module) {
      throw new Error("Module not found");
    }
    return module.lessons.map((lesson: any) => lesson._id.toString());
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching module lessons");
  }
};

export const updateUserProgress = async (
  userId: string,
  moduleId: string,
  lessonId: string
) => {
  try {
    const lessonResult = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          [`progress.${lessonId}`]: true,
        },
      },
      { new: true }
    );

    const moduleLessons = await getModuleLessons(moduleId);
    const user: any = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isModuleCompleted = moduleLessons.every(
      (lesson) => user.progress[lesson] === true
    );

    if (isModuleCompleted) {
      const moduleResult = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            [`progress.${moduleId}`]: true,
          },
        },
        { new: true }
      );
      console.log("Module completed");
      return moduleResult;
    } else {
      console.log("Lesson completed but module not yet completed");
      return lessonResult;
    }
  } catch (err) {
    console.error(err);
  }
};
