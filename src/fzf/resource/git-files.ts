import { filePreviewCommand } from "@/fzf/util"
import { globalVariableSelector } from "@/module/selector/vim-variable"
import { execSyncCommand } from "@/system/command"
import { isGitDirectory } from "@/system/project"
import type { FzfCommandDefinitionDefaultOption, ResourceLines, SourceFuncArgs } from "@/type"

// eslint-disable-next-line @typescript-eslint/require-await
export const gitFiles = async (_args: SourceFuncArgs): Promise<ResourceLines> => {
  if (!isGitDirectory()) {
    throw new Error("The current directory is not a git project")
  }

  const gitFilesCommand = globalVariableSelector("fzfPreviewGitFilesCommand")

  if (typeof gitFilesCommand !== "string") {
    return []
  }

  const { stdout, stderr, status } = execSyncCommand(gitFilesCommand)

  if (stderr !== "" || status !== 0) {
    throw new Error(`Failed to get the file list. command: "${gitFilesCommand}"`)
  }

  return stdout.split("\n").filter((file) => file !== "")
}

export const gitFilesDefaultOptions = (): FzfCommandDefinitionDefaultOption => ({
  "--prompt": '"GitFiles> "',
  "--multi": true,
  "--preview": filePreviewCommand(),
})