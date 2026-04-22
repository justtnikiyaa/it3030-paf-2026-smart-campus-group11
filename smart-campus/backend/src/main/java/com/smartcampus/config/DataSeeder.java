package com.smartcampus.config;

import com.smartcampus.resource.model.Resource;
import com.smartcampus.resource.model.enums.ResourceStatus;
import com.smartcampus.resource.model.enums.ResourceType;
import com.smartcampus.resource.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@Configuration
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ResourceRepository resourceRepository;

    @Override
    public void run(String... args) throws Exception {
        if (resourceRepository.count() > 0) return;

        Random random = new Random();
        
        String[] mainSides = {"A", "B"};
        int[] mainFloors = {3, 4, 5, 6};

        String[] newSides = {"F", "G"};
        int[] newFloors = {3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13};

        int[] labCaps = {25, 60};
        int[] hallCaps = {250, 175, 100};

        List<Resource> toSave = new ArrayList<>();

        // Helper to generate unique location code
        List<String> usedCodes = new ArrayList<>();

        // Generate 20 Lecture Halls
        while (toSave.size() < 20) {
            boolean isMain = random.nextBoolean();
            String side = isMain ? mainSides[random.nextInt(mainSides.length)] : newSides[random.nextInt(newSides.length)];
            int floor = isMain ? mainFloors[random.nextInt(mainFloors.length)] : newFloors[random.nextInt(newFloors.length)];
            String num = String.format("%02d", random.nextInt(20) + 1);
            String code = side + floor + num;

            if (usedCodes.contains(code)) continue;
            usedCodes.add(code);

            String buildingName = isMain ? "Main Building" : "New Building";
            String location = buildingName + ", Side " + side + ", Floor " + floor + ", Room " + num;

            Resource r = Resource.builder()
                    .name("Lecture Hall " + code)
                    .type(ResourceType.LECTURE_HALL)
                    .status(ResourceStatus.ACTIVE)
                    .capacity(hallCaps[random.nextInt(hallCaps.length)])
                    .location(location)
                    .availabilityWindows("Mon-Sun 08:00-17:30")
                    .description("Large lecture hall located in " + buildingName + ". Fully equipped with a projector and sound system.")
                    .build();
            toSave.add(r);
        }

        // Generate 15 Labs
        int startingSize = toSave.size();
        while (toSave.size() < startingSize + 15) {
            boolean isMain = random.nextBoolean();
            String side = isMain ? mainSides[random.nextInt(mainSides.length)] : newSides[random.nextInt(newSides.length)];
            int floor = isMain ? mainFloors[random.nextInt(mainFloors.length)] : newFloors[random.nextInt(newFloors.length)];
            String num = String.format("%02d", random.nextInt(20) + 1);
            String code = side + floor + num;

            if (usedCodes.contains(code)) continue;
            usedCodes.add(code);

            String buildingName = isMain ? "Main Building" : "New Building";
            String location = buildingName + ", Side " + side + ", Floor " + floor + ", Room " + num;

            Resource r = Resource.builder()
                    .name("Lab " + code)
                    .type(ResourceType.LAB)
                    .status(ResourceStatus.ACTIVE)
                    .capacity(labCaps[random.nextInt(labCaps.length)])
                    .location(location)
                    .availabilityWindows("Mon-Fri 08:00-20:30")
                    .description("Highly specialized computer lab in " + buildingName + ". Available for evening student sessions.")
                    .build();
            toSave.add(r);
        }

        // Mark 3 random resources as OUT_OF_SERVICE
        Collections.shuffle(toSave);
        for (int i = 0; i < 3; i++) {
            toSave.get(i).setStatus(ResourceStatus.OUT_OF_SERVICE);
        }

        resourceRepository.saveAll(toSave);
        System.out.println("✅ DataSeeder successfully seeded " + toSave.size() + " test resources into the H2 database.");
    }
}
