def process_command(command: str) -> str:
    """
    Mock implementation of Planner Agent delegating to specialized agents.
    In a real implementation, we would use google-genai or a custom ADK system
    to orchestrate the multi-agent workflow.
    """
    command_lower = command.lower()
    
    if "describe" in command_lower or "what is" in command_lower:
        return "Scene Description Agent: You are in a well-lit room with a laptop and a mug."
    elif "detect" in command_lower or "where is" in command_lower:
        return "Object Detection Agent: The laptop is straight ahead. The mug is to your right."
    elif "read" in command_lower or "text" in command_lower:
        return "OCR Agent: The text says 'VisionGuide AI Dashboard'."
    elif "currency" in command_lower or "money" in command_lower:
        return "Currency Agent: This is a twenty dollar bill."
    elif "remember" in command_lower:
        return "Memory Agent: I will remember that you placed your keys on the table."
    else:
        return "Voice Interaction Agent: I didn't catch that. Can you repeat or ask me to describe the scene?"
