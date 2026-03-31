import random
import re

class ScriptGenerator:
    def __init__(self, db):
        self.library = db['script_library']
        
    def generate_from_title(self, title, niche="Tech", style="Educational"):
        """Generates a structured script based on viral patterns in the database."""
        
        # 1. Find a reference script (high-retention) from the niche
        # If niche is unknown, get top-performing scripts generally
        ref_script_doc = self.library.find_one(
            {"niche": niche}, 
            sort=[("retention", -1)]
        )
        
        if not ref_script_doc:
            ref_script_doc = self.library.find_one(
                sort=[("retention", -1)]
            )
            
        ref_text = ref_script_doc['script'] if ref_script_doc else ""
        
        # 2. Extract structure (Heuristic: Hook/Body/CTA)
        # We use a standard viral structure and inject the user's title
        
        hook_templates = [
            f"Wait! Did you know that {title.lower()} is actually changing everything?",
            f"If you're still doing [Problem], you need to see why {title} is the secret.",
            f"Stop! Most people get {title} completely wrong. Here's the truth.",
            f"I found the absolute best way to handle {title}, and it's simpler than you think."
        ]
        
        body_points = [
            f"First, let's talk about the structure of {title}.",
            f"The biggest mistake people make with this is [Mistake].",
            f"But the real secret lies in [Pro-Tip].",
            f"If you apply this correctly, your results with {title} will double."
        ]
        
        cta_templates = [
            f"This was the breakdown for {title}. If you want more, hit that subscribe button!",
            f"Check the link in my bio if you want to master {title} today.",
            f"Drop a comment: what is your biggest challenge with {title}?"
        ]
        
        # 3. Assemble the script
        hook = random.choice(hook_templates)
        body = "\n\n".join(random.sample(body_points, 3))
        cta = random.choice(cta_templates)
        
        full_script = f"🪝 HOOK:\n{hook}\n\n📝 CONTENT:\n{body}\n\n🚀 CALL TO ACTION:\n{cta}"
        
        # 4. Refine with "Viral Elements" (Pattern interrupts)
        full_script = self._add_pattern_interrupts(full_script)
        
        return full_script

    def _add_pattern_interrupts(self, text):
        """Injects visual/pacing cues into the script."""
        pacing_cues = [
            "[VISUAL: ZOOM IN]",
            "[VISUAL: FAST CUT]",
            "[AUDI0: POP SFX]",
            "[VISUAL: TEXT OVERLAY]"
        ]
        
        sections = text.split('\n\n')
        refined_sections = []
        for i, section in enumerate(sections):
            refined_sections.append(section)
            if i < len(sections) - 1 and random.random() > 0.5:
                refined_sections.append(random.choice(pacing_cues))
        
        return "\n\n".join(refined_sections)
