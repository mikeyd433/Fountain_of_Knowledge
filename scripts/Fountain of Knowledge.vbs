' Launches launch.bat completely hidden, so the only window you see is the
' app itself (plus a minimized "server" window you can close to quit).
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
sh.Run """" & dir & "\launch.bat""", 0, False
