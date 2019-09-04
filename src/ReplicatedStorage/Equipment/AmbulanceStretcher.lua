Tool = script.Parent
local arms = nil
local torso = nil
local welds = {}
local module = {}


function Equip(mouse)
    wait(0.01)
    arms = {
        Tool.Parent:FindFirstChild("Left Arm"),
        Tool.Parent:FindFirstChild("Right Arm")
    }
    torso = Tool.Parent:FindFirstChild("Torso")
    if arms ~= nil and torso ~= nil then
        local sh = {
            torso:FindFirstChild("Left Shoulder"),
            torso:FindFirstChild("Right Shoulder")
        }
        if sh ~= nil then
            local yes = true
            if yes then
                yes = false
                sh[1].Part1 = nil
                sh[2].Part1 = nil
                local weld1 = Instance.new("Weld")
                weld1.Part0 = torso
                weld1.Parent = torso
                weld1.Part1 = arms[1]
                weld1.C1 = CFrame.new(-0.5, 0.5, 1.5) *
                               CFrame.fromEulerAnglesXYZ(math.rad(270), 0,
                                                         math.rad(-90))
                welds[1] = weld1
                local weld2 = Instance.new("Weld")
                weld2.Part0 = torso
                weld2.Parent = torso
                weld2.Part1 = arms[2]
                weld2.C1 = CFrame.new(-1.5, 0.5, 0.5) *
                               CFrame.fromEulerAnglesXYZ(math.rad(-90),
                                                         math.rad(0), 0)
                welds[2] = weld2
            end
        else
            print("sh")
        end
    else
        print("arms")
    end
end

function Unequip(mouse)
    if arms ~= nil and torso ~= nil then
        local sh = {
            torso:FindFirstChild("Left Shoulder"),
            torso:FindFirstChild("Right Shoulder")
        }
        if sh ~= nil then
            local yes = true
            if yes then
                yes = false
                sh[1].Part1 = arms[1]
                sh[2].Part1 = arms[2]
                welds[1].Parent = nil
                welds[2].Parent = nil
            end
        else
            print("sh")
        end
    else
        print("arms")
    end
end

function Weld(x,y)
	local W = Instance.new("Weld")
	W.Part0 = x
	W.Part1 = y
	local CJ = CFrame.new(x.Position)
	local C0 = x.CFrame:inverse()*CJ
	local C1 = y.CFrame:inverse()*CJ
	W.C0 = C0
	W.C1 = C1
	W.Parent = x
end

function Get(A)
	if A.Name == "Part" then
		Weld(script.Parent.Handle, A)
		A.Anchored = false
	else
		local C = A:GetChildren()
		for i=1, #C do
		Get(C[i])
		end
	end
end

function Finale()
	Get(script.Parent)
end


Tool.Equipped:connect(Finale)
Tool.Unequipped:connect(Finale)
Finale()
Tool.Equipped:connect(Equip)
Tool.Unequipped:connect(Unequip)

function module.new(toolModel)
    local tool = {}
    
    tool.Equipped:connect(Finale)
    tool.Unequipped:connect(Finale)
    Finale()
    tool.Equipped:connect(Equip)
    tool.Unequipped:connect(Unequip)
end

return module
